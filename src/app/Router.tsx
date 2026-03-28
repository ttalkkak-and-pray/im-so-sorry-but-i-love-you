import { BrowserRouter, Route, Routes } from 'react-router';
import { InterrogationPage } from './pages/InterrogationPage';
import ConfessionPage from './pages/ConfessionPage';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InterrogationPage />} />
        <Route path="/confession" element={<ConfessionPage />} />
      </Routes>
    </BrowserRouter>
  );
}
