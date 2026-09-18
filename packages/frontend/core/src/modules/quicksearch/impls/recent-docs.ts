import { Entity, LiveData } from '@toeverything/infra';

import type { DocDisplayMetaService } from '../../doc-display-meta';
import type { OrganizeService } from '../../organize';
import type { QuickSearchSession } from '../providers/quick-search-provider';
import type { RecentDocsService } from '../services/recent-pages';
import type { QuickSearchGroup } from '../types/group';
import type { QuickSearchItem } from '../types/item';

// Going back to a recent doc is the likeliest reason to open the palette with
// nothing typed, so recents lead. Five is enough to cover "the thing I was
// just in" without pushing everything else off screen.
const MAX_RECENT_DOCS = 5;

const group = {
  id: 'recent-docs',
  label: {
    i18nKey: 'com.affine.cmdk.affine.category.affine.recent',
  },
  score: 15,
} as QuickSearchGroup;

export class RecentDocsQuickSearchSession
  extends Entity
  implements QuickSearchSession<'recent-doc', { docId: string }>
{
  constructor(
    private readonly recentDocsService: RecentDocsService,
    private readonly docDisplayMetaService: DocDisplayMetaService,
    private readonly organizeService: OrganizeService
  ) {
    super();
  }

  query$ = new LiveData('');

  items$: LiveData<QuickSearchItem<'recent-doc', { docId: string }>[]> =
    LiveData.computed(get => {
      const query = get(this.query$);

      if (query) {
        return []; /* recent docs only for empty query */
      }

      const docRecords = this.recentDocsService.getRecentDocs();

      return docRecords
        .filter(doc => !get(doc.trash$))
        .slice(0, MAX_RECENT_DOCS)
        .map<QuickSearchItem<'recent-doc', { docId: string }>>(docRecord => {
          const { title, icon } =
            this.docDisplayMetaService.getDocDisplayMeta(docRecord);

          return {
            id: 'recent-doc:' + docRecord.id,
            source: 'recent-doc',
            group: group,
            label: {
              title: title,
            },
            score: 0,
            icon,
            timestamp: docRecord.meta$.value.updatedDate,
            location: this.organizeService.folderTree
              .docFolderPath(docRecord.id)
              .join(' / '),
            payload: { docId: docRecord.id },
          };
        });
    });

  query(query: string) {
    this.query$.next(query);
  }
}
