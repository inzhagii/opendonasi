import { BrowserRouter } from 'react-router-dom';
import { DonationProvider } from './app/context/DonationContext';
import { RootLayout } from './components/layout/RootLayout';
import { AppRoutes } from './app/routes';

export default function App() {
  return (
    <BrowserRouter>
      <DonationProvider>
        <RootLayout>
          <AppRoutes />
        </RootLayout>
      </DonationProvider>
    </BrowserRouter>
  );
}
