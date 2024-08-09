import axios from 'axios';
import { useQuery } from 'react-query';

function Dashboard() {
  const dashboardEmbedUrl = useQuery('dashboardEmbedUrl', async () => {
    return axios.get('/reports/member').then((response) => {
      return response.data.url;
    });
  });

  return (
    <div>
      {dashboardEmbedUrl.isLoading && <div>Loading...</div>}
      {dashboardEmbedUrl.data && (
        <iframe
          src={dashboardEmbedUrl.data}
          frameBorder="0"
          width="100%"
          height="800"
          allowTransparency
        />
      )}
    </div>
  );
}

export default Dashboard;
