import { BrowserRouter } from 'react-router-dom';
import { DonationProvider } from './app/context/DonationContext';
import { AppRoutes } from './app/routes';

export default function App() {
  return (
    <BrowserRouter>
      <DonationProvider>
        <div className="min-h-screen flex flex-col bg-background text-text-primary font-sans antialiased">
          <AppRoutes />
        </div>
      </DonationProvider>
    </BrowserRouter>
  );
}
