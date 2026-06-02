import { TestBed } from '@angular/core/testing';
import { SolicitanteService } from './solicitante';

describe('Solicitante', () => {
  let service: SolicitanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitanteService);
  });

  it('should be created', () => { expect(service).toBeTruthy(); });
});