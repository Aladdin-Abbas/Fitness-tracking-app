import { useState, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';

type AccelerometerData = {
  x: number;
  y: number;
  z: number;
};


const STEP_THRESHOLD = 1.2; 
const STEP_DELAY = 100; // Minimum time (in ms) between steps

export const useStepCounter = (isActive: boolean) => {
  const [steps, setSteps] = useState(0);
  const [lastStepTime, setLastStepTime] = useState(0);
  const [subscription, setSubscription] = useState<ReturnType<typeof Accelerometer.addListener> | null>(null);

  const detectStep = (data: AccelerometerData) => {
    const magnitude = Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);
    const currentTime = Date.now();

    if (magnitude > STEP_THRESHOLD && currentTime - lastStepTime > STEP_DELAY) {
      const steps = Math.floor( magnitude / STEP_THRESHOLD );
      setSteps((prev) => prev + steps);
      setLastStepTime(currentTime);
    }
  };

  useEffect(() => {
    if (isActive) {
      Accelerometer.setUpdateInterval(STEP_DELAY);
      const subscription = Accelerometer.addListener(detectStep);
      setSubscription(subscription);
    } else {
      if (subscription) {
        subscription.remove();
        setSubscription(null);
      }
      // Remove automatic step reset when stopping
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isActive]);

  const resetSteps = () => {
    setSteps(0);
    setLastStepTime(0);
  };

  return { steps, resetSteps };
};