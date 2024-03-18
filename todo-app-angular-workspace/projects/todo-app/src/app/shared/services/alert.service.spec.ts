import { AlertService } from "./alert.service";

describe('alert service', () => {
  it('should alert message', () => {
    const alertService = new AlertService();
    const mockedWindow = { window: {}, alert: (message: string) => {} };
    spyOnProperty(alertService, 'window', 'get').and.returnValue(mockedWindow as unknown as any);
    spyOn(mockedWindow, 'alert').and.callThrough();

    alertService.alert('Test message');

    expect(mockedWindow.alert).toHaveBeenCalledWith('Test message');
    expect(alertService.window as any).toEqual(mockedWindow);
  });

  it('should return global window object', () => {
    const alertService = new AlertService();

    expect(alertService.window).toEqual(window);
  });
});
