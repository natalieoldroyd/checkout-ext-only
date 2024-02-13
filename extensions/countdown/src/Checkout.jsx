import React, { useEffect, useState } from 'react';
import {
  reactExtension,
  BlockStack,
  Text,
  useSettings,
  View,
  useStorage
} from '@shopify/ui-extensions-react/checkout';

// render('Checkout::Dynamic::Render', () => <App />);

const timer = reactExtension('purchase.checkout.header.render-after', () => <App />);

function App() {
  const {
    timer_before_text,
    timer_after_text,
    timer,
    timer_ends,
    timer_text_color,
    timer_text_size,
    timer_size,
    timer_color
  } = useSettings();

  const calculateEndTime = (timer) => {
    const currentTime = new Date();
    const endTime = new Date(currentTime.getTime() + timer * 60000); // Convert minutes to milliseconds

    return endTime;
  };

  const getRemainingTimeInSeconds = (endTime) => {
    const currentTime = new Date();
    const remainingTimeInSeconds = Math.floor((endTime - currentTime) / 1000);

    return remainingTimeInSeconds >= 0 ? remainingTimeInSeconds : 0;
  };

  const setCookie = (name, value, days) => {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
  };

  const getCookie = (name) => {
    const cookieName = `${name}=`;
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }

    return '';
  };

  const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const storedEndTime = getCookie('endTime');
    let endTime;

    if (storedEndTime) {
      endTime = new Date(storedEndTime);

      // If the stored end time has already passed, clear it and recalculate the end time
      if (endTime <= new Date()) {
        deleteCookie('endTime');
        endTime = calculateEndTime(isNaN(timer) ? +timer : timer); // Set the timer to 15 minutes
      }
    } else {
      endTime = calculateEndTime(isNaN(timer) ? +timer : timer); // Set the timer to 15 minutes
      setCookie('endTime', endTime.toUTCString(), 1);
    }

    setSeconds(getRemainingTimeInSeconds(endTime));

    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 0) {
          clearInterval(interval); // Stop the timer
          deleteCookie('endTime');
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const formattedTime = React.useMemo(() => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, [seconds]);

  return (
    <BlockStack
      border="base"
      borderRadius="base"
      padding="tight"
      spacing="loose"
      blockAlignment="center"
      cornerRadius="loose"
      overflow="hidden"
      inlineAlignment="center"
    >
      <View>
        <Text size={timer_text_size} appearance={timer_text_color} emphasis="strong">
          {timer_before_text}
        </Text>
        {seconds > 0 ? (
          <Text size={timer_size} emphasis="strong" appearance={timer_color}>
            {formattedTime}
          </Text>
        ) : (
          <Text size={timer_size} appearance={timer_color} emphasis="strong">
            {timer_ends}
          </Text>
        )}
        <Text size={timer_text_size} appearance={timer_text_color} emphasis="strong">
          {timer_after_text}
        </Text>
      </View>
    </BlockStack>
  );
}

export default App;
