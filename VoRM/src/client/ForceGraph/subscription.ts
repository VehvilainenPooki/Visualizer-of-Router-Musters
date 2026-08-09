export const makeSubscription = () => {
  const subscribers: Array<() => void> = []
  return {
    subscribe: (subscriber: () => void) => {
      subscribers.push(subscriber)
      return () => {
        const index = subscribers.indexOf(subscriber)
        if (index !== -1) subscribers.splice(index, 1)
      }
    },
    notify: () => subscribers.forEach(subscriber => subscriber())
  }
}
