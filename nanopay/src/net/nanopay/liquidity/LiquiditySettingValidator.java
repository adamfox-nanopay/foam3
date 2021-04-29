package net.nanopay.liquidity;

import foam.core.FObject;
import foam.core.Validator;
import foam.core.X;

public class LiquiditySettingValidator implements Validator {

  @Override
  public void validate(X x, FObject obj) {

    if ( ! ( obj instanceof LiquiditySettings ) ) {
      throw new RuntimeException("you can only put instanceof LiquiditySettings to LiquiditySettingsDAO");
    }

    LiquiditySettings ls = (LiquiditySettings) obj;

    Liquidity high = ls.getHighLiquidity();
    Liquidity low = ls.getLowLiquidity();

    if ( high.getEnabled() &&
         high.getThreshold() <= high.getResetBalance() && high.getRebalancingEnabled() == true )
         throw new RuntimeException("The high liquidity reset balance must be less then the threshold balance");

    if ( low.getEnabled() &&
         low.getThreshold() >= low.getResetBalance() && low.getRebalancingEnabled() == true )
         throw new RuntimeException("The low liquidity reset balance must be more then the threshold balance");


    if ( high.getEnabled() && low.getEnabled() ) {

      if ( high.getThreshold() <= low.getThreshold() )
        throw new RuntimeException("The high liquidity threshold must be above the low liquidity threshold");

      if ( low.getRebalancingEnabled() == true && high.getRebalancingEnabled() == true ) {

        if ( high.getResetBalance() <= low.getThreshold() )
          throw new RuntimeException("The low liquidity threshold must be below the high liquidity reset balance");

        if ( low.getResetBalance() >= high.getThreshold() )
          throw new RuntimeException("The high liquidity threshold must be above the low liquidity reset balance");
      }
    }
  }

}