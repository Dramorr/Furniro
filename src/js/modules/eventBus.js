const listeners = {};

export const eventBus = {
  on(event, callback) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
  },
  off(event, callback) {
    listeners[event] = listeners[event]?.filter((cb) => cb !== callback);
  },
  emit(event, payload) {
    if (!listeners[event]) return;
    listeners[event].forEach((cb) => cb(payload));
  },
};
