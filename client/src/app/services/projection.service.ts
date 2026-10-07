import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectionInput, ProjectionResult } from '../models/projection.model';

@Injectable({ providedIn: 'root' })
export class ProjectionService {
  private readonly http = inject(HttpClient);

  project(input: ProjectionInput): Observable<ProjectionResult> {
    return this.http.post<ProjectionResult>('/api/projections', input);
  }
}
