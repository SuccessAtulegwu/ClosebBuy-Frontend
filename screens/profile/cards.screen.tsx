import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Switch } from 'react-native'
import React, { useContext, useState } from 'react'
import { ThemeContext } from '@/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';

export function CardScreen() {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const inset = useSafeAreaInsets();
  const router = useRouter();

  const [expandedId, setExpandedId] = useState<string | null>('1');

  const [cards, setCards] = useState([
    {
      id: '1',
      type: 'Master Card',
      number: 'XXXX XXXX XXXX 5678',
      expiry: '01/22',
      cvv: '908',
      holderName: 'Russell Austin',
      isDefault: true,
      brand: 'mastercard'
    },
    {
      id: '2',
      type: 'Visa Card',
      number: 'XXXX XXXX XXXX 5678',
      expiry: '01/22',
      cvv: '908',
      holderName: 'Visa Card', // In design logic, sometimes people put type as name if not personalized
      isDefault: false,
      brand: 'visa'
    },
    {
      id: '3',
      type: 'Master Card',
      number: 'XXXX XXXX XXXX 5678',
      expiry: '01/22',
      cvv: '908',
      holderName: 'Master Card',
      isDefault: false,
      brand: 'mastercard'
    }
  ]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleDefault = (id: string) => {
    setCards(cards.map(card => ({
      ...card,
      isDefault: card.id === id
    })));
  };

  const renderBrandIcon = (brand: string) => {
    if (brand === 'mastercard') {
      return (
        <View style={styles.mastercardContainer}>
          <View style={[styles.mcCircle, styles.mcRed]} />
          <View style={[styles.mcCircle, styles.mcOrange]} />
        </View>
      );
    } else if (brand === 'visa') {
      return (
        <View style={styles.visaContainer}>
          <Text style={styles.visaText}>VISA</Text>
        </View>
      );
    }
    return <Ionicons name="card-outline" size={24} color="#9CA3AF" />;
  };

  const renderCardItem = (item: any) => {
    const isExpanded = expandedId === item.id;

    return (
      <View key={item.id} style={styles.cardContainer}>
        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>DEFAULT</Text>
          </View>
        )}

        {/* Header / Summary */}
        <TouchableOpacity
          style={[styles.cardHeader, isExpanded && styles.cardHeaderExpanded]}
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.8}
        >
          <View style={styles.headerLeft}>
            <View style={styles.iconCircle}>
              {renderBrandIcon(item.brand)}
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.cardTypeText}>{item.type}</Text>
              <Text style={styles.cardNumberText}>{item.number}</Text>
              <View style={styles.expiryRow}>
                <Text style={styles.expiryLabel}>Expiry : </Text>
                <Text style={styles.expiryValue}>{item.expiry}</Text>
                <Text style={[styles.expiryLabel, { marginLeft: 16 }]}>CVV : </Text>
                <Text style={styles.expiryValue}>{item.cvv}</Text>
              </View>
            </View>
          </View>
          <Ionicons
            name={isExpanded ? "chevron-up-circle-outline" : "chevron-down-circle-outline"}
            size={24}
            color={isExpanded ? "#84CC16" : "#10B981"} // Design has green
          />
        </TouchableOpacity>

        {/* Expanded Form */}
        {isExpanded && (
          <View style={styles.formContainer}>
            {/* Name Input */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={item.holderName}
                  placeholder="Name on Card"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Card Number Input */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <Ionicons name="card-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={item.number}
                  placeholder="Card Number"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Expiry & CVV Row */}
            <View style={styles.row}>
              <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
                <View style={styles.inputContainer}>
                  <Ionicons name="calendar-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={item.expiry}
                    placeholder="MM/YY"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
              <View style={[styles.inputWrapper, { flex: 1, marginLeft: 8 }]}>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={item.cvv}
                    placeholder="CVV"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                  />
                </View>
              </View>
            </View>

            {/* Make Default Toggle */}
            <View style={styles.toggleRow}>
              <Switch
                trackColor={{ false: '#D1D5DB', true: '#84CC16' }}
                thumbColor={'#FFFFFF'}
                ios_backgroundColor="#D1D5DB"
                onValueChange={() => toggleDefault(item.id)}
                value={item.isDefault}
              />
              <Text style={styles.toggleLabel}>Make default</Text>
            </View>

          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{
        headerBackTitle:'Back',
        headerTitle: 'My Cards',
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: theme.text,
        },
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerShadowVisible: false,
      }} />

      <ThemedView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {cards.map(renderCardItem)}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: inset.bottom + 20 }]}>
          <TouchableOpacity style={styles.saveButton} onPress={() => router.back()}>
            <Text style={styles.saveButtonText}>Save settings</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </>
  )
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F9FAFB',
    },
    scrollContent: {
      padding: 20,
      gap: 20,
      paddingBottom: 100,
    },
    cardContainer: {
      backgroundColor: 'transparent',
      marginBottom: 10,
    },
    defaultBadge: {
      position: 'absolute',
      top: -10,
      left: 0,
      backgroundColor: '#ECFCCB',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      zIndex: 10,
    },
    defaultText: {
      fontSize: 10,
      color: '#65A30D',
      fontWeight: 'bold',
    },
    cardHeader: {
      backgroundColor: '#FFFFFF',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    cardHeaderExpanded: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
      shadowOpacity: 0,
      elevation: 0,
    },
    headerLeft: {
      flexDirection: 'row',
      flex: 1,
    },
    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#F3F4F6', // Light grey for card icons in this design (or white? image shows logos on white circle/light bg)
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    // Mock Mastercard Icon
    mastercardContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: 30,
      height: 20,
    },
    mcCircle: {
      width: 18,
      height: 18,
      borderRadius: 9,
      position: 'absolute',
    },
    mcRed: {
      backgroundColor: '#EB001B',
      left: 0,
    },
    mcOrange: {
      backgroundColor: '#F79E1B',
      right: 0,
      opacity: 0.8,
    },
    // Mock Visa Icon
    visaContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    visaText: {
      fontWeight: '900',
      fontSize: 14,
      color: '#1A1F71',
      fontStyle: 'italic',
    },
    headerInfo: {
      flex: 1,
      paddingTop: 2,
    },
    cardTypeText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: 4,
    },
    cardNumberText: {
      fontSize: 13,
      color: '#6B7280',
      marginBottom: 6,
    },
    expiryRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    expiryLabel: {
      fontSize: 11,
      color: '#9CA3AF',
      fontWeight: '500',
    },
    expiryValue: {
      fontSize: 11,
      color: '#1F2937',
      fontWeight: '600',
      marginLeft: 4,
    },
    formContainer: {
      backgroundColor: '#FFFFFF',
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      padding: 20,
      paddingTop: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
      marginBottom: 10,
    },
    inputWrapper: {
      marginBottom: 12,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F3F4F6', // Grey input background
      borderRadius: 8,
      paddingHorizontal: 12,
      height: 48,
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      fontSize: 14,
      color: '#1F2937',
    },
    row: {
      flexDirection: 'row',
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    toggleLabel: {
      fontSize: 14,
      color: '#1F2937',
      marginLeft: 12,
      fontWeight: '500',
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#F9FAFB',
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    saveButton: {
      backgroundColor: '#84CC16', // Lime green
      height: 54,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#84CC16',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    }
  })
}