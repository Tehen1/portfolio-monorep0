import type { NftBike, Rarity } from '../../types';
import { APP_CONFIG } from './constants';

export const calculateUpgradeCost = (level: number): number => {
  return level * APP_CONFIG.TOKEN_ECONOMY.UPGRADE_COST_BASE;
};

export const determineRarity = (level: number, attributes: NftBike['attributes']): Rarity => {
  const totalAttributes = attributes.efficiency + attributes.resistance + attributes.chance;
  
  if (level >= 10 || totalAttributes >= 180) return 'Epic';
  if (level >= 6 || totalAttributes >= 120) return 'Rare';
  if (level >= 3 || totalAttributes >= 50) return 'Uncommon';
  return 'Common';
};

export const calculateLootBoxChance = (
  baseChance: number,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  distance: number
): number => {
  const difficultyConfig = APP_CONFIG.DIFFICULTY_LEVELS[difficulty];
  const distanceBonus = Math.floor(distance / APP_CONFIG.LOOT_BOX.DISTANCE_BONUS_UNIT) 
    * (APP_CONFIG.LOOT_BOX.DISTANCE_BONUS_RATE * 100);
  
  return baseChance + difficultyConfig.bonusChance + distanceBonus;
};

export const calculateEarnings = (
  distance: number,
  efficiency: number,
  difficulty: 'Easy' | 'Medium' | 'Hard'
): number => {
  const difficultyConfig = APP_CONFIG.DIFFICULTY_LEVELS[difficulty];
  const baseRate = APP_CONFIG.TOKEN_ECONOMY.DISTANCE_RATE;
  
  return (distance * baseRate) * (1 + efficiency / 100) * difficultyConfig.multiplier;
};

export const generateRandomAttributes = (currentAttributes: NftBike['attributes']): NftBike['attributes'] => {
  return {
    efficiency: Math.min(100, currentAttributes.efficiency + Math.floor(Math.random() * 5) + 2),
    resistance: Math.min(100, currentAttributes.resistance + Math.floor(Math.random() * 5) + 2),
    chance: Math.min(100, currentAttributes.chance + Math.floor(Math.random() * 3) + 1),
  };
};