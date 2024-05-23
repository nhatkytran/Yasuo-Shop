import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import GlobalStyles from '~/styles/GlobalStyles';
import { EN_US } from './config';
import Layout from '~/layouts';
import { publicRoutes } from './routes';
import { CheckLanguage } from './pages';

// Check language

function App() {
  return (
    <>
      <GlobalStyles />

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

          {/* Check language and error boundary */}
          {/* Some thing went wrong page! -> Naviagte to page not found with different error message -> use none layout */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
