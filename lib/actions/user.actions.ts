"use server";

import { Query, ID } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { string } from "zod";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])]
  );

  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

/*
The commented out code didn't work because:
 Error: "ReferenceError: sessionStorage is not defined" occurred when trying to use `sessionStorage` in the server-side context (during SSR or server-side execution).
 This error happened because `sessionStorage` is only available in the browser environment, not on the server.
 
 Fix: The code was updated to check if we are running in the browser by verifying `typeof window !== 'undefined'`. 
 This ensures that `sessionStorage` is only accessed when the code is running in the client-side environment.



export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return sessionStorage.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};*/

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();
  try {
    const session = await account.createEmailToken(ID.unique(), email);

    // Check if we are in the browser before accessing sessionStorage
    if (typeof window !== 'undefined' && window.sessionStorage) {
      // Use sessionStorage only in the browser
      sessionStorage.setItem("userId", session.userId);
    }

    return session.userId;
  } catch (error) {
    console.error("Failed to send email OTP", error);
    throw new Error("Failed to send email OTP");
  }
};


export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP({ email });
  if (!accountId) throw new Error("Failed to send an OTP");

  if (!existingUser) {
    const { databases } = await createAdminClient();

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar:
          "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
        accountId,
      }
    );
  }

  return parseStringify({accountId});
};

export const verifySecret = async({accountId, password}: {accountId:string; password:string}) =>{

  try{
    const {account} = await createAdminClient();
    const session = await account.createSession(accountId, password);
    (await cookies()).set('appwrite-session', session.secret, {path:'/', httpOnly: true, sameSite:'strict',secure: true,});

    return parseStringify({sessionId: session.$id})


  }catch(error){
    handleError(error, "Failed to verify OTP")
  }
}
