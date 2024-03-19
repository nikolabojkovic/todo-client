import { AlertService } from './alert.service';

describe('alert service', () => {
  it('should alert message', () => {
    const alertService = new AlertService();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockedWindow = { window: {}, alert: (message?: string) => {} };
    spyOnProperty(alertService, 'window', 'get').and.returnValue(mockedWindow as unknown as Window & typeof globalThis);
    spyOn(mockedWindow, 'alert').and.callThrough();

    alertService.alert('Test message');

    expect(mockedWindow.alert).toHaveBeenCalledWith('Test message');
    expect(alertService.window).toEqual(mockedWindow as unknown as Window & typeof globalThis);
  });

  it('should return global window object', () => {
    const alertService = new AlertService();

    expect(alertService.window).toEqual(window);
  });
});
