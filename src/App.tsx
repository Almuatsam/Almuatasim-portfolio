import { Route, Routes } from 'react-router-dom';
import { RootRedirect } from './routes/RootRedirect';
import { LanguageLayout } from './routes/LanguageLayout';
import { OpenBookLayout } from './routes/OpenBookLayout';
import { Cover } from './components/cover/Cover';
import { PlainVersion } from './components/plain/PlainVersion';

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/:lang" element={<LanguageLayout />}>
        <Route index element={<Cover />} />
        <Route path="plain" element={<PlainVersion />} />
        <Route path=":slug" element={<OpenBookLayout />} />
      </Route>
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

export default App;
