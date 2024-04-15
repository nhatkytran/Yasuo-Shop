const { NODE_ENV } = process.env;

const env = new (class Env {
  public get dev(): boolean {
    return NODE_ENV === 'development';
  }

  public get prod(): boolean {
    return NODE_ENV === 'production';
  }
})();

export default env;
