import React, { useMemo, useCallback } from 'react';
import { Colors, Image, Text, View, TouchableOpacity } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';

import { Slug, ActionChange } from '../../../types/distribution';
import styles from './styles';

type ChannelsOptionProps = {
  name: string;
  description?: string;
  assetName?: Slug;
  selected: boolean;
  onChangeValue: (channel: Slug, action: ActionChange) => void;
};

type ChannelsProps = {
  name: string;
  slug: Slug;
  description?: string;
  selected?: boolean;
};

type WhereToDistributeProps = {
  channelSelected: Slug[];
  onChangeChannel: (channel: Slug[]) => void;
};

const CHANNELS: ChannelsProps[] = [
  {
    name: 'Redes sociais',
    slug: 'social-network',
    description: 'Poste no feed da sua página do Facebook e/ou no feed do seu perfil no Instagram.',
  },
  {
    name: 'WhatsApp',
    slug: 'whatsapp',
    description: 'Envie mensagens no WhatsApp para seus grupos e contatos.',
  },
  {
    name: 'Ação turbinada',
    slug: 'turbocharged-action',
    description: 'Faça publicações patrocinadas e selecione um público específico para ver suas ofertas.',
  },
  {
    name: 'SMS',
    slug: 'sms',
  },
];

export function WhereToDistribute({ channelSelected, onChangeChannel }: WhereToDistributeProps) {
  const channels = useMemo(() => {
    if (!channelSelected.length) {
      return CHANNELS.map(channel => ({ ...channel, selected: false }));
    }
    return CHANNELS.map(channel => {
      const isChannelSelected = channelSelected.find(selected => selected === channel.slug);
      if (isChannelSelected) {
        return { ...channel, selected: true };
      }
      return { ...channel, selected: false };
    });
  }, [channelSelected]);

  const handleChangeChannels = useCallback(
    (channel: Slug, action: ActionChange) => {
      if (action === 'add') {
        onChangeChannel([...channelSelected, channel]);
      } else if (action === 'remove') {
        const findIndex = channelSelected.findIndex(selected => selected === channel);
        channelSelected.splice(findIndex, 1);
        onChangeChannel([...channelSelected]);
      }
    },

    [channelSelected]
  );

  function ChannelsOption({ name, description, assetName, selected, onChangeValue }: ChannelsOptionProps) {
    return (
      <View marginT-s5>
        <TouchableOpacity onPress={() => onChangeValue(assetName as Slug, selected ? 'remove' : 'add')}>
          <View row padding-s3 style={selected ? styles.optionSelected : styles.option}>
            <View row style={styles.containerIconText}>
              {assetName === 'social-network' ? (
                <>
                  <Image marginR-s2 resizeMode='contain' assetGroup='distribute' assetName='facebook' />
                  <Image marginR-s2 resizeMode='contain' assetGroup='distribute' assetName='instagram' />
                </>
              ) : (
                <Image marginR-s2 resizeMode='contain' assetGroup='distribute' assetName={assetName} />
              )}
              <Text grey30 text65L>
                {name}
              </Text>
            </View>
            {selected && <Feather style={styles.icon} size={22} name='check' />}
          </View>
        </TouchableOpacity>
        <Text marginT-s2 text80L color={Colors.grey30}>
          {description}
        </Text>
      </View>
    );
  }
  return (
    <View flex padding-page>
      <Text text60L>Quais canais deseja distribuir ?</Text>
      {channels.map(channel => (
        <ChannelsOption
          key={channel.slug}
          name={channel.name}
          description={channel.description}
          assetName={channel.slug}
          selected={channel.selected}
          onChangeValue={handleChangeChannels}
        />
      ))}
    </View>
  );
}
