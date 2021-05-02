// function getDateWithString(dt: Date) {
export const getDateWithString = (dt: Date, delimter: string) => {
  // alert(idx);
  // alert(dt);
  let date = new Date(dt);
  // let y = dt.substring(0, 4);
  // let m = dt.substring(4, 2);
  // let d = dt.substring(6, 2);
  let y = date.getFullYear();
  let m = ("00" + (date.getMonth()+1)).slice(-2);
  let d = ("00" + date.getDate()).slice(-2);
  let result = y + delimter + m + delimter + d;
  return result;
}
