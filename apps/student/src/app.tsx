import { Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import { Routing } from './routes/Routing';

export function App() {
  return (
    <Routes>
      <Route path="/student" element={<Layout />}>
        {Routing.map((route, index) => {
          return (
            <Route
              key={index + 0}
              path={route.path}
              element={<route.element />}
            />
          );
        })}
      </Route>
    </Routes>
  );
}

export default App;
