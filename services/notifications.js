import firestore from "@react-native-firebase/firestore";

export const getNotifications = async () => {
  try {
    const snapshot = await firestore()
      .collection("notifications")
      .orderBy("date", "desc")
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

export const subscribeToNotifications = (userId, callback) => {
  return firestore()
    .collection("notifications")
    .where("userId", "==", userId)
    .onSnapshot((snapshot) => {
      const notifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(notifications);
    });
};
