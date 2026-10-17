import { Route, Routes } from 'react-router-dom';
import { RootRedirect } from './routes/RootRedirect';
import { LanguageLayout } from './routes/LanguageLayout';
import { BookFlipApp } from './components/flipbook/BookFlipApp';
import { PlainVersion } from './components/plain/PlainVersion';

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/:lang" element={<LanguageLayout />}>
        <Route index element={<BookFlipApp />} />
        <Route path="plain" element={<PlainVersion />} />
        <Route path=":slug" element={<BookFlipApp />} />
      </Route>
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

export default App;
