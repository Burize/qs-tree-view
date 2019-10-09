export default function getEnvParams() {
  const env = process.env.NODE_ENV;
  const apiUrl = process.env.API_URL;
  const withAnalyze = process.env.WITH_ANALYZE_MODE;

  const envParams = {
    env,
    apiUrl,
    withAnalyze,
  };

  return envParams;
}
