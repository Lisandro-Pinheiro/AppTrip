import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  onFilterButtonClick: () => void;
  onZoomButtonClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onFilterButtonClick, onZoomButtonClick }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onFilterButtonClick}>
          <MaterialIcons name="filter-list" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onZoomButtonClick}>
          <MaterialIcons name="zoom-in" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
});

export default Header;
