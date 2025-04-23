export const stopAvatarGeneration = async (params: any, token: string) => {
  try {
    const response = await fetch(
      "https://avatar19413587.plavno.app:24828/stop",
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
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Success:", data);
  } catch (error) {
    console.error("Error stopping avatar generation:", error);
  }
};
