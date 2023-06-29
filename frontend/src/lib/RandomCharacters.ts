import { oneOf } from 'aimless.js';
import type { TRelationship } from '../types';
import type { TCharacter } from '../../../shared';

const maleNames = [
  "Gavin",
  "Erik",
  "Finn",
  "Duncan",
  "Liam",
  "Rowan",
  "Kieran",
  "Cormac",
  "Rhys",
  "Bran",
  "Soren",
  "Magnus",
  "Rory",
  "Conall",
  "Gareth",
  "Declan",
  "Alaric",
  "Eamon",
  "Orin",
  "Ivar",
  "Cian",
  "Tobin",
  "Oisin",
  "Cillian",
  "Niall"
];

var femaleNames = [
  "Aria",
  "Zara",
  "Sage",
  "Nia",
  "Kira",
  "Leilani",
  "Amara",
  "Kai",
  "Esme",
  "Seren",
  "Emery",
  "Mika",
  "Layla",
  "Ayla",
  "Nala",
  "Iris",
  "Nova",
  "Maya",
  "Sasha",
  "Elara",
  "Jaya",
  "Nyx",
  "Zuri",
  "Raya",
  "Evelyn"
];

export type TSkinColorStrings =  'a' | 'c' | 'db' | 'mb';

export function generateCharacters() {
  let availableRelationships: TRelationship[] = [
    'King', 'Queen', 'Older Daughter', 'Younger Daughter', 'Older Son', 'Younger Son', 'General', 'Bishop',
    'Advisor', "King's Brother", "Queen's Brother", "King's Newphew"
  ];

  const characters: TCharacter[] = [];

  for (let i = 0; i < 6; i++) {
    let relationship = '';
    if (i === 0) { 
      relationship = oneOf(['King', 'Queen']);
    } else {
      relationship = oneOf(availableRelationships);
    }
    console.log(relationship);
    
    availableRelationships = availableRelationships.filter(r => r !== relationship);
    
    const names = ['King', 'Older Son', 'Younger Son', "King's Brother", "Queen's Brother", "King's Newphew", "Bishop", "Advisor", "General"].includes(relationship) ? maleNames : femaleNames;
    let possibleSkinColors: TSkinColorStrings[] = ['a', 'c', 'db', 'mb'];

    if (['Older Daughter', 'Younger Daughter', 'Older Son', 'Younger Son'].includes(relationship) && characters.length > 0) {
      const parents = characters.filter(c => ['King', 'Queen'].includes(c.relationship));

      // Children can be on the spectrum of their parents skin color. If we only have 1 known parent, kids match parents skin.
      if (parents.length === 1) {
        possibleSkinColors = [parents[0].skinColor];
      } else if (parents.length > 1) {
        possibleSkinColors = [];
        if (parents.reduce((count, element) => element.skinColor === 'db' ? count + 1 : count, 0) === 1) {
          possibleSkinColors.push('db');
        } else {
          possibleSkinColors.push('db', 'mb');
        }
        if (parents.find(p => p.skinColor === 'mb')) possibleSkinColors.push('mb');
        if (parents.find(p => p.skinColor === 'c')) possibleSkinColors.push('c');
        if (parents.find(p => p.skinColor === 'a')) possibleSkinColors.push('a');
      }
    }

    characters.push({
      id: i,
      name: oneOf(names),
      relationship: relationship as TRelationship,
      skinColor: oneOf(possibleSkinColors),
    });
  }

  return characters;
}


