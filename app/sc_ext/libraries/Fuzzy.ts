module SitecoreExtensions.Libraries {
    export class Fuzzy {
        analyzeSubTerms = false;
        analyzeSubTermDepth = 10;
        highlighting = {
            before: '<em>',
            after: '</em>'
        };

        matchComparator = (m1, m2) => {
            return (m2.score - m1.score != 0) ? m2.score - m1.score : m1.term.length - m2.term.length;
        }

        getScore(term, query) {
            var max = this.calcFuzzyScore(term, query);
            var termLength = term.length;

            if (this.analyzeSubTerms) {

                for (var i = 1; i < termLength && i < this.analyzeSubTermDepth; i++) {
                    var subTerm = term.substring(i);
                    var score = this.calcFuzzyScore(subTerm, query);
                    if (score.score > max.score) {
                        score.term = term;
                        score.highlightedTerm = term.substring(0, i) + score.highlightedTerm;
                        max = score;
                    }
                }
            }
            return max;
        };

        private calcFuzzyScore(term, query) {
            var score = 0;
            var termLength = term.length;
            var queryLength = query.length;
            var highlighting = '';
            var ti = 0;
            var previousMatchingCharacter = -2;

            for (var qi = 0; qi < queryLength && ti < termLength; qi++) {
                var qc = query.charAt(qi);
                var lowerQc = qc.toLowerCase();

                for (; ti < termLength; ti++) {
                    var tc = term.charAt(ti);

                    if (lowerQc === tc.toLowerCase()) {
                        score++;

                        if ((previousMatchingCharacter + 1) === ti) {
                            score += 2;
                        }

                        highlighting += this.highlighting.before +
                            tc +
                            this.highlighting.after;
                        previousMatchingCharacter = ti;
                        ti++;
                        break;
                    } else {
                        highlighting += tc;
                    }
                }
            }

            highlighting += term.substring(ti, term.length);

            return {
                score: score,
                term: term,
                query: query,
                highlightedTerm: highlighting
            };
        };
    }
}