import { JournalEntry } from '../types';

const TAROT_CARDS = [
    { name: 'The Fool', meaning: 'New beginnings, innocence, spontaneity.' },
    { name: 'The Magician', meaning: 'Manifestation, resourcefulness, power.' },
    { name: 'The High Priestess', meaning: 'Intuition, sacred knowledge, divine feminine.' },
    { name: 'The Empress', meaning: 'Femininity, beauty, nature, nurturing.' },
    { name: 'The Emperor', meaning: 'Authority, establishment, structure.' },
];

export const drawTarotCard = () => {
    const randomIndex = Math.floor(Math.random() * TAROT_CARDS.length);
    return TAROT_CARDS[randomIndex];
};

export const saveJournalEntry = async (entry: JournalEntry) => {
    // In a real app, save to storage/backend
    console.log('Saving entry:', entry);
    return true;
};
