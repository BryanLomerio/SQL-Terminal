export const uint8ArrayToBase64 = (u8Arr) => {
  const CHUNK_SIZE = 0x8000;
  let index = 0;
  let result = '';
  while (index < u8Arr.length) {
    result += String.fromCharCode.apply(
      null,
      u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, u8Arr.length))
    );
    index += CHUNK_SIZE;
  }
  return btoa(result);
};

export const base64ToUint8Array = (base64) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};
