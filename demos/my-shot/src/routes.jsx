import Main from './components/pages/main';
import Lorem from './components/pages/lorem';
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
        path: 'lorem',
        element: <Lorem />
      }
    ]
  }
];
