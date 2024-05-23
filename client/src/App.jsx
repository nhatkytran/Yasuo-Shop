import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import GlobalStyles from '~/styles/GlobalStyles';
import Layout from '~/layouts';
import { publicRoutes } from './routes';

// Check language

function App() {
  return (
    <>
      <GlobalStyles />

      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate replace to="/en-us" />} />

          {publicRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout type={route.layout}>
                  <route.component />
                </Layout>
              }
            />
          ))}

          {/* Check language and error boundary */}
          {/* Some thing went wrong page! -> Naviagte to page not found with different error message -> use none layout */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
