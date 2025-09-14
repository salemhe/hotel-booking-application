type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

interface Greeting {
  timePhrase: string;
  greeting: string;
}

export const getTimeBasedGreeting = (): Greeting => {
  const hour = new Date().getHours();
  
  let timeOfDay: TimeOfDay;
  if (hour >= 5 && hour < 12) {
    timeOfDay = 'morning';
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = 'afternoon';
  } else if (hour >= 17 && hour < 21) {
    timeOfDay = 'evening';
  } else {
    timeOfDay = 'night';
  }
  
  const greetings: Record<TimeOfDay, Greeting> = {
    morning: {
      timePhrase: "Good morning",
      greeting: "Have a great start to your day"
    },
    afternoon: {
      timePhrase: "Good afternoon",
      greeting: "Hope your day is going well"
    },
    evening: {
      timePhrase: "Good evening",
      greeting: "Have a pleasant evening"
    },
    night: {
      timePhrase: "Good night",
      greeting: "Rest well"
    }
  };
  
  return greetings[timeOfDay];
};