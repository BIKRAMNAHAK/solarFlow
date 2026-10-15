// Permission ka status check karo: "granted", "denied" ya "prompt"
export const checkLocationPermission = async () => {
  if (!navigator.permissions) return "unknown";
  const result = await navigator.permissions.query({ name: "geolocation" });
  return result.state;
};

// User ki current location lo (browser permission mangega)
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Aapka browser location support nahi karta"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        if (error.code === 1) reject(new Error("Location permission deny ho gayi"));
        else if (error.code === 2) reject(new Error("Location mil nahi payi"));
        else reject(new Error("Location lene me time out ho gaya"));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
};