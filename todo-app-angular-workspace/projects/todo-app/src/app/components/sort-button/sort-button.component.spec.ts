import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { stateTestData } from '../../shared/test-data';
import { IState } from '../../shared/state/state';
import { SortButtonComponent } from './sort-button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SortIconComponent } from '../sort-icon/sort-icon.component';
import { MockLocalStorageProvider } from '../../shared/mocks/local-storage-provider.mock';
import { StorageProviderKey } from '../../shared/services/storage-provider.service';

describe('SortButtonComponent', () => {
  let component: SortButtonComponent;
  let fixture: ComponentFixture<SortButtonComponent>;
  let store: MockStore<IState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SortButtonComponent, SortIconComponent],
      imports: [FontAwesomeModule],
      providers: [
        provideMockStore({ stateTestData } as any), 
        {
          provide: StorageProviderKey,
          useClass: MockLocalStorageProvider
        },
      ]
    });
    fixture = TestBed.createComponent(SortButtonComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
