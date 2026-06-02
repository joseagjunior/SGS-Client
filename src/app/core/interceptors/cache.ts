import { HttpInterceptorFn, HttpResponse } from "@angular/common/http";
import { of, tap } from "rxjs";


const cache = new Map<string, HttpResponse<unknown>>();

const CACHEABLE_URLS = [
    '/categorias',
    '/solicitantes'
];

const INVALIDATE_URLS = [ '/solicitacoes' ];

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.method !== 'GET') {
        if (INVALIDATE_URLS.some(url => req.url.includes(url)))
            cache.clear();

        return next(req);
    }

    const shouldCache = CACHEABLE_URLS.some(url => req.url.includes(url));
    if (!shouldCache)
        return next(req);

    const cached = cache.get(req.url);
    if (cached)
        return of(cached.clone());

    return next(req).pipe(
        tap(event => {
            if (event instanceof HttpResponse)
                cache.set(req.url, event.clone());
        })
    );
};