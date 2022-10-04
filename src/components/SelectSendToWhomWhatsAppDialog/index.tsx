import { map, isEmpty } from 'lodash';
import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import {
  Button,
  Colors,
  Dialog,
  PanningProvider,
  Text,
  View,
  TouchableOpacity,
  Checkbox,
  LoaderScreen,
} from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import { useQuery } from 'react-query';

import { listWhatsAppGroupsService } from '../../services/whatsAppInstance';
import { ActionChange, SlugSendToWhatsApp } from '../../types/distribution';
import { SEND_TO_WHOM_WHATSAPP } from '../../utils/constants';
import { widthPercentageToDP, heightPercentageToDP } from '../../utils/dimensions';
import styles from './styles';

type SelectSendtoWhomWhatsAppProps = {
  visible: boolean;
  selectedSendTo: SlugSendToWhatsApp[];
  instanceId: number;
  selectedGroups: string[];
  onSave: (groupsId: string[]) => void;
  onChangeSendTo: (channel: SlugSendToWhatsApp[]) => void;
  onClose: () => void;
};

type DownloadOptionsProps = {
  value: string;
  name: string;
  selected: boolean;
  onChangeValue: (channel: SlugSendToWhatsApp, action: ActionChange) => void;
};

export function SelectSendtoWhomWhatsApp({
  visible,
  instanceId,
  selectedSendTo,
  selectedGroups,
  onClose,
  onChangeSendTo,
  onSave,
}: SelectSendtoWhomWhatsAppProps) {
  const [selectedGroupsId, setSelectedGroupsId] = useState<string[]>(selectedGroups);

  const haveSelectedGroup = useMemo(() => {
    return selectedSendTo.some(sendTo => sendTo === 'group');
  }, [selectedSendTo]);

  const sendToOptions = useMemo(() => {
    if (!selectedSendTo.length) {
      return SEND_TO_WHOM_WHATSAPP.map(sendTo => ({
        ...sendTo,
        selected: false,
      }));
    }
    return SEND_TO_WHOM_WHATSAPP.map(sendTo => {
      const isChannelSelected = selectedSendTo.find(selected => selected === sendTo.value);
      if (isChannelSelected) {
        return { ...sendTo, selected: true };
      }
      return { ...sendTo, selected: false };
    });
  }, [selectedSendTo]);

  const handleChangeSendTo = useCallback(
    (sendTo: SlugSendToWhatsApp, action: ActionChange) => {
      if (action === 'add') {
        onChangeSendTo([...selectedSendTo, sendTo]);
      } else if (action === 'remove') {
        const findIndex = selectedSendTo.findIndex(selected => selected === sendTo);
        selectedSendTo.splice(findIndex, 1);
        onChangeSendTo([...selectedSendTo]);
      }
    },

    [selectedSendTo]
  );

  const handleSelectedGroupsToSend = useCallback((isSelected: boolean, groupId: string) => {
    if (isSelected) {
      setSelectedGroupsId(prev => prev.filter(i => i !== groupId));
    } else {
      setSelectedGroupsId(prev => [...prev, groupId]);
    }
  }, []);

  const handleClose = useCallback(() => {
    setSelectedGroupsId(selectedGroups);
    onClose();
  }, [onClose, selectedGroups]);

  const handleSave = useCallback(() => {
    onSave(selectedGroupsId);
    onClose();
  }, [selectedGroupsId, onSave, onClose]);

  const groups = useQuery(['groups', instanceId], () => listWhatsAppGroupsService(instanceId), {
    enabled: haveSelectedGroup,
  });

  useEffect(() => {
    if (!haveSelectedGroup) {
      setSelectedGroupsId(selectedGroups);
    }
  }, [haveSelectedGroup, selectedGroups]);

  useEffect(() => {
    if (instanceId) {
      setSelectedGroupsId([]);
      onSave([]);
    }
  }, [instanceId]);

  function SendToOptions({ value, name, selected, onChangeValue }: DownloadOptionsProps) {
    return (
      <TouchableOpacity
        marginB-s4
        onPress={() => onChangeValue(value as SlugSendToWhatsApp, selected ? 'remove' : 'add')}>
        <View row padding-s3 style={selected ? styles.optionSelected : styles.option}>
          <Text adjustsFontSizeToFit grey30 text70L>
            {name}
          </Text>
          {selected && <Feather style={styles.icon} size={22} name='check' />}
        </View>
      </TouchableOpacity>
    );
  }

  function ListGroups() {
    if (groups.isLoading) {
      return <LoaderScreen color={Colors.primary} message='Carregando...' overlay />;
    }

    if (isEmpty(groups.data)) {
      return (
        <View center flex>
          <Text marginL-s3 grey10 text70R numberOfLines={1}>
            Nenhum grupo foi encontrado
          </Text>
        </View>
      );
    }
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {map(groups.data, group => {
          const isSelected = selectedGroupsId.some(i => i === group.ID);
          return (
            <TouchableOpacity
              onPress={() => handleSelectedGroupsToSend(isSelected, group.ID)}
              key={group.ID}
              paddingV-s2
              row
              style={styles.optionItemGroup}>
              <Checkbox borderRadius={2} size={18} disabled={!isSelected} value={isSelected} />
              <Text marginL-s3 grey10 text70R numberOfLines={1}>
                {group.NAME}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  }

  return (
    <Dialog
      visible={visible}
      height={heightPercentageToDP('75%')}
      onDismiss={handleClose}
      panDirection={PanningProvider.Directions.DOWN}
      width={widthPercentageToDP('90%')}
      containerStyle={{
        backgroundColor: Colors.white,
        borderRadius: 8,
      }}>
      <View flex padding-page>
        <Text text60M>Para quais contatos deseja enviar?</Text>
        <View paddingV-s4 flex useSafeArea>
          {sendToOptions.map(send => (
            <SendToOptions
              selected={send.selected}
              key={send.value}
              value={send.value}
              name={send.label}
              onChangeValue={handleChangeSendTo}
            />
          ))}
          {haveSelectedGroup && <ListGroups />}
        </View>
        <View style={styles.actions}>
          <Button link label='Cancelar' color={Colors.grey20} onPress={handleClose} />
          <Button onPress={handleSave} label='Concluir' />
        </View>
      </View>
    </Dialog>
  );
}
