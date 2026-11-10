import { create } from "zustand";

export const useCounterStore = create((set) => ({
  good: 0,
  neutral: 0,
  bad: 0,
  actions: {
    good_increment: () => set((state) => ({ good: state.good + 1 })),
    neutral_increment: () => set((state) => ({ neutral: state.neutral + 1 })),
    bad_increment: () => set((state) => ({ bad: state.bad + 1 })),
  },
}));

// the hook functions that are used elsewhere in app
// export const useGoodvalue = () => useCounterStore((state) => state.good); //the functions useCounter, which returns the good value
// export const useNeutralvalue = () => useCounterStore((state) => state.neutral); //the functions useCounter, which returns the neutral
// export const useBadvalue = () => useCounterStore((state) => state.bad); //the functions useCounter, which returns the bad value

export const useCounterControls = () => {
  const { good_increment, neutral_increment, bad_increment } = useCounterStore(
    (state) => state.actions,
  );
  return { good_increment, neutral_increment, bad_increment };
};

export const useGoodvalue = () => useCounterStore((state) => state.good);
export const useNeutralvalue = () => useCounterStore((state) => state.neutral);
export const useBadvalue = () => useCounterStore((state) => state.bad);
