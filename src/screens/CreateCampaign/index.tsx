import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button, Colors, Text, View } from 'react-native-ui-lib';
import { useMutation } from 'react-query';
import { LoaderDialog } from '../../components/LoaderDialog';
import { useToast } from '../../hooks/useToast';
import { createCampaignService } from '../../services/campaigns';
import { queryClient } from '../../services/queryClient';
import { AppScreenProp } from '../../types/navigation';
import styles from './styles';

export function CreateCampaign() {
  const { navigate } = useNavigation<AppScreenProp>();

  const toast = useToast();

  const newCampaign = useMutation(
    async () => {
      const response = await createCampaignService({});

      return response;
    },
    {
      onSuccess: data => {
        queryClient.invalidateQueries('campaigns');

        navigate('Campaign', {
          campaignId: data.id,
          campaignName: data.name,
          activeTabIndex: 1,
        });
      },
      onError: () => {
        toast.show('Erro ao criar campanha', {
          variant: 'error',
        });
      },
    }
  );

  const handleNewCampaign = async () => {
    await newCampaign.mutateAsync();
  };

  return (
    <>
      <View flex center padding-page>
        <Button
          backgroundColor={Colors.rgba(Colors.secondary, 0.1)}
          borderRadius={4}
          style={{ height: 49, width: '100%' }}
          onPress={handleNewCampaign}>
          <Text text70BO color={Colors.rgba(Colors.secondary, 0.9)}>
            CRIAR LISTA DE PRODUTOS
          </Text>
        </Button>
      </View>

      <LoaderDialog
        visible={newCampaign.isLoading}
        onRequestClose={() => {
          newCampaign.reset();
        }}
      />
    </>
  );
}
