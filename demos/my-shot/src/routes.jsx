import Main from './components/pages/main';
import Lorem from './components/pages/lorem';
import VectorStore from './components/pages/vectorstore';
import Root from './Root';

export const routes = [
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Main />
      },
      {
        path: 'vector-store',
        element: <VectorStore />
      },
      {
        path: 'lorem',
        element: <Lorem />
      }
    ]
  }
];
