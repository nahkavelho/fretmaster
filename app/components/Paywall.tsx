import React from 'react';
import { View, Text, Modal, Pressable, ActivityIndicator, Platform, Alert } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeContext } from '../ThemeContext';
import { setIsPro } from '../../firebase';

export const PRO_PRODUCT_ID = 'fretmaster_pro_unlock';
export const PRO_PRICE_DISPLAY = '$4.99';

interface PaywallProps {
  visible: boolean;
  onClose: () => void;
  onPurchaseSuccess: () => void;
  userId: string | null | undefined;
}

const Paywall: React.FC<PaywallProps> = ({ visible, onClose, onPurchaseSuccess, userId }) => {
  const { palette, themeName } = React.useContext(ThemeContext);
  const [loading, setLoading] = React.useState(false);

  const handlePurchase = async () => {
    if (!userId) {
      Alert.alert('Not logged in', 'Please log in first.');
      return;
    }
    setLoading(true);
    try {
      // TODO: Wire up real Google Play Billing via react-native-iap when the
      // app is published to Play Store internal testing with a configured
      // managed product (PRO_PRODUCT_ID).
      //
      // For now (dev build), we simulate a successful purchase by flipping
      // the isPro flag in Firestore directly. This lets you test the gating
      // end-to-end before the store listing is live.
      if (__DEV__) {
        Alert.alert(
          'Dev Mode Purchase',
          'Real in-app purchases are not active yet. Simulate a successful purchase and unlock Pro?',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => setLoading(false) },
            {
              text: 'Unlock Pro',
              onPress: async () => {
                await setIsPro(userId, true);
                setLoading(false);
                onPurchaseSuccess();
                onClose();
                Alert.alert('Welcome to Pro!', 'All 46 levels and every string are now unlocked.');
              },
            },
          ]
        );
        return;
      }

      Alert.alert(
        'Coming soon',
        'In-app purchases will be enabled when FretMaster is live on Google Play.'
      );
    } catch (e: any) {
      Alert.alert('Purchase failed', e?.message || 'Something went wrong.');
    } finally {
      if (!__DEV__) setLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // TODO: When react-native-iap is wired up, call getAvailablePurchases()
      // and flip isPro on if a matching purchase is found.
      Alert.alert(
        'Restore purchases',
        'Sign in with the same account you used to buy Pro on another device. (Real restore will work once the app is live on Google Play.)'
      );
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: 'unlock', label: 'All 46 levels unlocked' },
    { icon: 'guitar', label: 'Every string — E, A, D, G, B, high E' },
    { icon: 'palette', label: 'Acoustic theme' },
    { icon: 'infinity', label: 'Unlimited practice, forever' },
    { icon: 'heart', label: 'One-time payment, no subscription' },
  ];

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.65)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: palette.card,
            borderRadius: 20,
            padding: 24,
            width: '100%',
            maxWidth: 420,
            borderWidth: 1,
            borderColor: palette.primary,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 8 },
            elevation: 12,
          }}
        >
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: palette.primary,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <MaterialCommunityIcons name="crown" size={40} color={themeName === 'rocksmith' ? '#232526' : '#F8F4E1'} />
            </View>
            <Text
              style={{
                color: palette.text,
                fontSize: 26,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Unlock FretMaster Pro
            </Text>
            <Text
              style={{
                color: palette.textSecondary,
                fontSize: 14,
                marginTop: 6,
                textAlign: 'center',
              }}
            >
              Master the entire fretboard — not just the low E.
            </Text>
          </View>

          {/* Features */}
          <View style={{ marginBottom: 22 }}>
            {features.map((f) => (
              <View
                key={f.label}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: palette.modalBackground,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                    borderWidth: 1,
                    borderColor: palette.fretboardBorder,
                  }}
                >
                  <FontAwesome5 name={f.icon as any} size={14} color={palette.primary} />
                </View>
                <Text style={{ color: palette.text, fontSize: 15, flex: 1 }}>{f.label}</Text>
              </View>
            ))}
          </View>

          {/* Price */}
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ color: palette.textSecondary, fontSize: 13 }}>One-time purchase</Text>
            <Text
              style={{
                color: palette.primary,
                fontSize: 36,
                fontWeight: 'bold',
                letterSpacing: 0.5,
              }}
            >
              {PRO_PRICE_DISPLAY}
            </Text>
          </View>

          {/* Purchase button */}
          <Pressable
            disabled={loading}
            onPress={handlePurchase}
            style={({ pressed }) => ({
              backgroundColor: palette.primary,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
              opacity: pressed || loading ? 0.8 : 1,
              marginBottom: 10,
            })}
          >
            {loading ? (
              <ActivityIndicator color={themeName === 'rocksmith' ? '#232526' : '#F8F4E1'} />
            ) : (
              <Text
                style={{
                  color: themeName === 'rocksmith' ? '#232526' : '#F8F4E1',
                  fontSize: 17,
                  fontWeight: 'bold',
                }}
              >
                Unlock Pro — {PRO_PRICE_DISPLAY}
              </Text>
            )}
          </Pressable>

          {/* Restore */}
          <Pressable
            disabled={loading}
            onPress={handleRestore}
            style={{ paddingVertical: 10, alignItems: 'center' }}
          >
            <Text style={{ color: palette.textSecondary, fontSize: 14 }}>Restore purchase</Text>
          </Pressable>

          {/* Close */}
          <Pressable
            onPress={onClose}
            style={{ paddingVertical: 10, alignItems: 'center', marginTop: 2 }}
          >
            <Text style={{ color: palette.textSecondary, fontSize: 13 }}>Maybe later</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default Paywall;
