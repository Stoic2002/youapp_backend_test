export function calculateHoroscopeAndZodiac(birthdayString: string) {
    const birthday = new Date(birthdayString);
  
    if (isNaN(birthday.getTime())) {
      throw new Error('Invalid date format. Please use "DD MMM YYYY".');
    }
  
    const month = birthday.getMonth() + 1;
    const day = birthday.getDate();
  
    let horoscope = '';
    
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
      horoscope = 'Aquarius';
    } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
      horoscope = 'Pisces';
    } else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
      horoscope = 'Aries';
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
      horoscope = 'Taurus';
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
      horoscope = 'Gemini';
    } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
      horoscope = 'Cancer';
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
      horoscope = 'Leo';
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
      horoscope = 'Virgo';
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
      horoscope = 'Libra';
    } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
      horoscope = 'Scorpio';
    } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
      horoscope = 'Sagittarius';
    } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
      horoscope = 'Capricorn';
    }
  
    const year = birthday.getFullYear();
    const zodiac = getChineseZodiac(year);
  
    return { zodiac, horoscope,  };
  }
  
  function getChineseZodiac(year: number): string {
    const zodiacAnimals = [
      'Monkey', 'Rooster', 'Dog', 'Pig', 'Rat', 'Ox', 
      'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat'
    ];
    const index = (year - 4) % 12;
    return zodiacAnimals[index];
  }