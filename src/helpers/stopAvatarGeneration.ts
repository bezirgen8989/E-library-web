export const stopAvatarGeneration = async (params: any, token: string) => {
  try {
    const response = await fetch(
      "https://avatar19788240.plavno.app:43947/stop",
      {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      }
    );

    if (!response.ok) {
      throw new Error(`Err: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Success:", data);
  } catch (error) {
    console.error("Error stopping avatar generation:", error);
  }
};
