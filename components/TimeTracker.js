import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';

export default function TimeTracker() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning) timer = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  const toggleTimer = () => setRunning(!isRunning);

  return (
    <View style={{ marginTop: 10 }}>
      <Text>⏱️ {seconds} sec</Text>
      <Button title={isRunning ? "Stop" : "Start"} onPress={toggleTimer} />
    </View>
  );
}
