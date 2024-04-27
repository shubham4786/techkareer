import { randomUUID } from "crypto";
import { initializeApp } from "firebase/app";
import { ref, uploadBytes, getStorage, getDownloadURL } from "firebase/storage";
import { env } from "@/env";

const firebaseConfig = {
  apiKey: env.FIRESTORAGE_APIKEY,
  authDomain: env.FIRESTORAGE_AUTHDOMAIN,
  projectId: env.FIRESTORAGE_PROJECTID,
  storageBucket: env.FIRESTORAGE_STORAGEBUCKET,
  messagingSenderId: env.FIRESTORAGE_MESSAGINGSENDERID,
  appId: env.FIRESTORAGE_APPID,
  measurementId: env.FIRESTORAGE_MEASUREMENTID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export const uploadFileFirebase = async (
  userType: "jobseeker" | "organization",
  fileType: "resume" | "profilepic" | "project",
  file: File
) => {
  const reference = ref(
    storage,
    `${userType}/${fileType}/${file.name}-${randomUUID()}`
  );
  await uploadBytes(reference, file, {
    contentType: file.type,
  });
  return await getDownloadURL(reference);
};
