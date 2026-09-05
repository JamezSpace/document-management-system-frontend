import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmBreadcrumbList]',
})
export class HlmBreadcrumbList {
	constructor() {
		classes(() => 'text-muted-foreground flex flex-wrap items-center gap-0.25 text-sm break-words sm:gap-0.5');
	}
}
