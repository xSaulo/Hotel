import { hydrateRoot, createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

const root = document.getElementById('root')!;
const app = <App path={window.location.pathname} />;
// Las páginas vienen pregeneradas (HTML completo); React solo las "activa".
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
