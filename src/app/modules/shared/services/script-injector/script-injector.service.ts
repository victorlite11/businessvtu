import { Inject, Injectable, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScriptInjectorService {

  constructor(
    @Inject(DOCUMENT) private document : Document
  ) { }

  injectJSScript(renderer : Renderer2, src : string, containerClassName ?: string) : any{
    const scriptEl = renderer.createElement('script');
    scriptEl.type = "text/javascript";
    scriptEl.src = src;
    scriptEl.async = false;

    renderer.appendChild(containerClassName ? this.document.body.getElementsByClassName(containerClassName)[0] : this.document.body, scriptEl);
    return scriptEl;
  }
}
