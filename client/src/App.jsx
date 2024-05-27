import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { EN_US } from './config';
import Layout from '~/layouts';
import { publicRoutes } from './routes';
import { CheckLanguage } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate replace to={`/${EN_US}`} />} />

        {publicRoutes.map((route, index) => {
          const Component = route.component;

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <CheckLanguage>
                  <Layout type={route.layout}>
                    <Component />
                  </Layout>
                </CheckLanguage>
              }
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
