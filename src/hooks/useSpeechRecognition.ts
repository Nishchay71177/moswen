
export const useSpeechRecognition = () => {
  const startRecording = (): Promise<SpeechRecognition> => {
    return new Promise((resolve, reject) => {
      if (!('webkitSpeechRecognition' in window)) {
        reject(new Error('Speech recognition is not supported in this browser'));
        return;
      }

      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      resolve(recognition);
    });
  };

  return { startRecording };
};
