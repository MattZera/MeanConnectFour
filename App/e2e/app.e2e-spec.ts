import { AppPage } from './app.po';

import { expect } from 'chai';

describe('app App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).to.equal('Welcome to app!');
  });
});
