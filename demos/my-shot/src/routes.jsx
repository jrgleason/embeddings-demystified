import Main from './components/pages/main';
import Lorem from './components/pages/lorem';
import VectorStore from './components/pages/vectorstore';
import TSNEVisualization from './components/pages/tsne';
import EmbeddingDisplay from './components/pages/embedding';
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
        path: 'tsne-viz',
        element: <TSNEVisualization />
      },
      {
        path: 'embedding-display',
        element: <EmbeddingDisplay />
      },
      {
        path: 'lorem',
        element: <Lorem />
      }
    ]
  }
];
