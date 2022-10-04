import { useNavigation, useNavigationState } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Colors, Incubator, ListItem, Text, TouchableOpacity, Typography, View } from 'react-native-ui-lib';
import Feather from 'react-native-vector-icons/Feather';
import { useQuery } from 'react-query';

import { listPredictionService } from '../../services/placeAutocomplete';
import { AppScreenProp } from '../../types/navigation';
import { Prediction } from '../../types/placeAutocomplete';
import { getPreviousRouteFromState } from '../../utils/getPreviousRouteFromState';
import styles from './styles';

const { TextField } = Incubator;

export function PlaceAutocomplete() {
  const { goBack, navigate } = useNavigation<AppScreenProp>();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return
  const previousRoute = useNavigationState(s => getPreviousRouteFromState(s));

  const [searchTerm, setSearchTerm] = useState('');

  function handleClear() {
    setSearchTerm('');
  }

  const predictions = useQuery(['predictions', searchTerm], () => listPredictionService(searchTerm));

  function handleSelect(placeId: string) {
    navigate(previousRoute.name, { ...previousRoute.params, placeId });
  }

  function renderRow(item: Prediction) {
    return (
      <ListItem
        height={77.5}
        onPress={() => {
          handleSelect(item.place_id);
        }}>
        <ListItem.Part left marginH-14>
          <Feather name='map-pin' size={24} color={Colors.grey40} />
        </ListItem.Part>
        <ListItem.Part middle column>
          <ListItem.Part containerStyle={{ marginBottom: 3 }}>
            <Text grey10 text70 style={{ flex: 1, marginRight: 10 }} numberOfLines={2}>
              {item.structured_formatting.main_text}
            </Text>
          </ListItem.Part>
          <ListItem.Part>
            <Text style={{ flex: 1, marginRight: 10 }} text90 grey40 numberOfLines={2}>
              {item.description}
            </Text>
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>
    );
  }

  return (
    <View>
      <View paddingH-page paddingT-page>
        <TextField
          migrate
          autoFocus
          placeholder='Buscar endereço'
          autoComplete='off'
          autoCorrect={false}
          value={searchTerm}
          onChangeText={setSearchTerm}
          fieldStyle={styles.searchBar}
          leadingAccessory={
            <TouchableOpacity marginR-s4 activeBackgroundColor={Colors.grey70} onPress={goBack}>
              <Feather name='arrow-left' size={Typography.text50?.fontSize} color={Colors.primary} />
            </TouchableOpacity>
          }
          trailingAccessory={
            searchTerm.length > 0 ? (
              <TouchableOpacity activeBackgroundColor={Colors.grey70} onPress={handleClear}>
                <Feather name='x-circle' size={Typography.text60?.fontSize} color={Colors.grey20} />
              </TouchableOpacity>
            ) : undefined
          }
        />
      </View>
      <FlatList
        keyExtractor={item => item.place_id}
        data={predictions.data}
        renderItem={({ item }) => renderRow(item)}
        showsVerticalScrollIndicator={false}
        refreshing={predictions.isFetching}
        refreshControl={<RefreshControl refreshing={predictions.isFetching} tintColor={Colors.secondary} />}
      />
    </View>
  );
}
